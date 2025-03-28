import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Cache control constants
const CACHE_MAX_AGE = 60 * 5; // 5 minutes in seconds
const STALE_WHILE_REVALIDATE = 60 * 60; // 1 hour in seconds
const CACHE_CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

// In-memory cache object (note: this will be reset on server restart/deployment)
let memoryCache: {
  allPaths?: { data: any; timestamp: number };
  pathDetails: { [key: string]: { data: any; timestamp: number } };
} = {
  allPaths: undefined,
  pathDetails: {}
};

// Check if cache is still valid
function isCacheValid(timestamp: number): boolean {
  const now = Date.now();
  return now - timestamp < CACHE_MAX_AGE * 1000; // Convert seconds to milliseconds
}

// Set up cache cleanup to prevent memory leaks
if (typeof global !== 'undefined') {
  // Only run in Node.js environment, not during build
  const cleanupCache = () => {
    const now = Date.now();
    const expiryTime = now - (CACHE_MAX_AGE * 2 * 1000); // Double the max age for cleanup
    
    // Clean up path details cache
    Object.keys(memoryCache.pathDetails).forEach(key => {
      if (memoryCache.pathDetails[key].timestamp < expiryTime) {
        delete memoryCache.pathDetails[key];
      }
    });
    
    // Log cache stats
    const pathDetailsCount = Object.keys(memoryCache.pathDetails).length;
    console.log(`🧹 Cache cleanup: ${pathDetailsCount} path details in cache`);
  };
  
  // Run cleanup periodically
  setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);
}

// Custom order for paths
const pathOrder: Record<string, number> = {
  'Diamond Path': 1,
  'Emerald Path': 2,
  'Sapphire Path': 3,
  'Amethyst Path': 4,
  'Ruby Path': 5
};

// GET: Fetch all learning paths or a specific one by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get('id');
    const skipCache = searchParams.get('skipCache') === 'true';
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Check cache first if not explicitly skipping cache
    if (!skipCache && !forceRefresh) {
      if (pathId && memoryCache.pathDetails[pathId] && isCacheValid(memoryCache.pathDetails[pathId].timestamp)) {
        console.log(`🔄 Cache hit for path ID: ${pathId}`);
        return NextResponse.json(memoryCache.pathDetails[pathId].data, {
          headers: {
            'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
            'X-Cache': 'HIT'
          }
        });
      } else if (!pathId && memoryCache.allPaths && isCacheValid(memoryCache.allPaths.timestamp)) {
        console.log('🔄 Cache hit for all paths');
        return NextResponse.json(memoryCache.allPaths.data, {
          headers: {
            'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
            'X-Cache': 'HIT'
          }
        });
      }
    }
    
    console.log(`🔍 Cache miss, fetching fresh data ${pathId ? `for path: ${pathId}` : 'for all paths'}`);
    
    // Use createClient instead of createRouteHandlerClient to bypass the cookie handling issues
    // This doesn't use auth features, so we don't need the cookies-based client
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    if (pathId) {
      // Fetch a specific learning path with its modules and items
      const { data: path, error: pathError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', pathId)
        .single();
      
      if (pathError) {
        console.error('Error fetching learning path:', pathError);
        return NextResponse.json({ error: pathError.message }, { status: 500 });
      }
      
      if (!path) {
        return NextResponse.json({ error: 'Learning path not found' }, { status: 404 });
      }
      
      // Get the modules for this path
      const { data: modules, error: modulesError } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('path_id', pathId)
        .order('order_index');
      
      if (modulesError) {
        console.error('Error fetching modules:', modulesError);
        return NextResponse.json({ 
          path,
          modules: [],
          error: 'Error fetching modules'
        });
      }
      
      // Get the items for each module
      const modulesWithItems = await Promise.all(
        (modules || []).map(async (module) => {
          const { data: items, error: itemsError } = await supabase
            .from('learning_items')
            .select('*')
            .eq('module_id', module.id)
            .order('order_index');
          
          return {
            ...module,
            items: items || [],
          };
        })
      );
      
      const responseData = {
        path,
        modules: modulesWithItems
      };
      
      // Update cache
      memoryCache.pathDetails[pathId] = {
        data: responseData,
        timestamp: Date.now()
      };
      
      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          'X-Cache': 'MISS'
        }
      });
    } else {
      // Fetch all learning paths
      const { data: paths, error } = await supabase
        .from('learning_paths')
        .select('*');
      
      if (error) {
        console.error('Error fetching learning paths:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      // Get module counts and problem counts for each path
      const pathsWithMetadata = await Promise.all(
        (paths || []).map(async (path) => {
          // Count the modules
          const { count: moduleCount, error: moduleCountError } = await supabase
            .from('learning_modules')
            .select('*', { count: 'exact', head: true })
            .eq('path_id', path.id);
          
          // First get module IDs for this path
          const { data: moduleIds } = await supabase
            .from('learning_modules')
            .select('id')
            .eq('path_id', path.id);
          
          // Then count items where module_id is in the list of module IDs
          let itemCount = 0;
          if (moduleIds && moduleIds.length > 0) {
            const moduleIdArray = moduleIds.map(m => m.id);
            const { count: ic, error: itemCountError } = await supabase
              .from('learning_items')
              .select('*', { count: 'exact', head: true })
              .in('module_id', moduleIdArray);
            
            itemCount = ic || 0;
          }
          
          // Estimate hours (assuming 30 minutes per item on average)
          const estimatedHours = Math.ceil(itemCount * 0.5);
          
          return {
            ...path,
            moduleCount: moduleCount || 0,
            problemCount: itemCount,
            estimatedHours
          };
        })
      );
      
      // Sort the paths in the specific order: Diamond, Emerald, Sapphire, Amethyst, Ruby
      const sortedPaths = pathsWithMetadata.sort((a, b) => {
        const orderA = pathOrder[a.title as string] || 999;
        const orderB = pathOrder[b.title as string] || 999;
        return orderA - orderB;
      });
      
      // Filter out any paths that are not in our desired list
      const filteredPaths = sortedPaths.filter(path => 
        path.title === 'Diamond Path' || 
        path.title === 'Emerald Path' || 
        path.title === 'Sapphire Path' || 
        path.title === 'Amethyst Path' || 
        path.title === 'Ruby Path'
      );
      
      const responseData = { paths: filteredPaths };
      
      // Update cache
      memoryCache.allPaths = {
        data: responseData,
        timestamp: Date.now()
      };
      
      return NextResponse.json(responseData, {
        headers: {
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          'X-Cache': 'MISS'
        }
      });
    }
  } catch (error) {
    console.error('Error in GET learning paths route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 