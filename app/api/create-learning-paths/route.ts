import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Create a Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Check if learning_paths table exists
    const { error: checkError } = await supabase.from('learning_paths').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('Learning paths tables do not exist, creating mock data...');
      
      // Since we can't create tables directly with the JavaScript client,
      // we'll just use hardcoded mock paths instead for testing the UI
      
      return NextResponse.json({ 
        success: true, 
        message: 'Tables do not exist. Use the Supabase SQL Editor to create them first, or use mock data.' 
      });
    }
    
    // Insert some sample data if tables exist but are empty
    const { data: paths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('*');
      
    if (pathsError) {
      return NextResponse.json({ 
        success: false, 
        error: `Error fetching paths: ${pathsError.message}` 
      }, { status: 500 });
    }
    
    // If paths exist, we're done
    if (paths && paths.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Learning paths already exist',
        count: paths.length
      });
    }
    
    // Insert sample paths if none exist
    const emeraldPathId = 'emerald-path';
    const sapphirePathId = 'sapphire-path';
    
    const { error: emeraldError } = await supabase
      .from('learning_paths')
      .insert({
        id: emeraldPathId,
        title: 'Emerald Path',
        description: 'Start your journey with the fundamentals of competitive programming. Learn basic algorithms and data structures.'
      });
      
    if (emeraldError) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to insert Emerald Path: ${emeraldError.message}` 
      }, { status: 500 });
    }
    
    const { error: sapphireError } = await supabase
      .from('learning_paths')
      .insert({
        id: sapphirePathId,
        title: 'Sapphire Path',
        description: 'Take your skills to the next level with intermediate algorithms and problem-solving techniques.'
      });
      
    if (sapphireError) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to insert Sapphire Path: ${sapphireError.message}` 
      }, { status: 500 });
    }
    
    // Insert sample modules for Emerald Path
    const { data: emeraldModules, error: emeraldModulesError } = await supabase
      .from('learning_modules')
      .insert([
        {
          title: 'Getting Started',
          description: 'Learn the basics of competitive programming',
          path_id: emeraldPathId,
          order_index: 1
        },
        {
          title: 'Basic Data Structures',
          description: 'Understand fundamental data structures',
          path_id: emeraldPathId,
          order_index: 2
        }
      ])
      .select();
      
    if (emeraldModulesError) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to insert Emerald modules: ${emeraldModulesError.message}` 
      }, { status: 500 });
    }
    
    // Insert sample modules for Sapphire Path
    const { data: sapphireModules, error: sapphireModulesError } = await supabase
      .from('learning_modules')
      .insert([
        {
          title: 'Intermediate Algorithms',
          description: 'Dive deeper into algorithmic techniques',
          path_id: sapphirePathId,
          order_index: 1
        },
        {
          title: 'Dynamic Programming',
          description: 'Master the art of dynamic programming',
          path_id: sapphirePathId,
          order_index: 2
        }
      ])
      .select();
      
    if (sapphireModulesError) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to insert Sapphire modules: ${sapphireModulesError.message}` 
      }, { status: 500 });
    }
    
    // Insert sample items for each module
    if (emeraldModules) {
      for (const module of emeraldModules) {
        const { error: itemsError } = await supabase
          .from('learning_items')
          .insert([
            {
              title: `Introduction to ${module.title}`,
              type: 'article',
              content: `<h1>Introduction to ${module.title}</h1><p>This is an introduction to ${module.title}. Here you'll learn the basics of this topic.</p>`,
              module_id: module.id,
              order_index: 1
            },
            {
              title: `Practice Problems for ${module.title}`,
              type: 'problems',
              content: `<h1>Practice Problems</h1><p>Here are some practice problems for ${module.title}.</p><ul><li>Problem 1</li><li>Problem 2</li></ul>`,
              module_id: module.id,
              order_index: 2
            }
          ]);
          
        if (itemsError) {
          return NextResponse.json({ 
            success: false, 
            error: `Failed to insert items for module ${module.id}: ${itemsError.message}` 
          }, { status: 500 });
        }
      }
    }
    
    if (sapphireModules) {
      for (const module of sapphireModules) {
        const { error: itemsError } = await supabase
          .from('learning_items')
          .insert([
            {
              title: `Introduction to ${module.title}`,
              type: 'article',
              content: `<h1>Introduction to ${module.title}</h1><p>This is an introduction to ${module.title}. Here you'll learn advanced concepts about this topic.</p>`,
              module_id: module.id,
              order_index: 1
            },
            {
              title: `Practice Problems for ${module.title}`,
              type: 'problems',
              content: `<h1>Practice Problems</h1><p>Here are some practice problems for ${module.title}.</p><ul><li>Problem 1</li><li>Problem 2</li></ul>`,
              module_id: module.id,
              order_index: 2
            }
          ]);
          
        if (itemsError) {
          return NextResponse.json({ 
            success: false, 
            error: `Failed to insert items for module ${module.id}: ${itemsError.message}` 
          }, { status: 500 });
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sample learning paths data inserted successfully' 
    });
    
  } catch (error: any) {
    console.error('Error inserting learning paths data:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to insert learning paths data' 
    }, { status: 500 });
  }
} 