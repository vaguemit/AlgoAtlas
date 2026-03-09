import Docker from 'dockerode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const docker = new Docker();

// Language configurations
const LANGUAGE_CONFIGS = {
  cpp: {
    image: 'gcc:latest',
    containerName: 'algoatlas_cpp',
  },
  python: {
    image: 'python:3.9-slim',
    containerName: 'algoatlas_python',
  },
  java: {
    image: 'openjdk:11-jdk-slim',
    containerName: 'algoatlas_java',
  },
};

async function ensureContainer(language: keyof typeof LANGUAGE_CONFIGS) {
  const config = LANGUAGE_CONFIGS[language];
  
  try {
    // Check if container exists
    const containers = await docker.listContainers({ all: true });
    const container = containers.find(c => c.Names.includes(`/${config.containerName}`));
    
    if (container) {
      // Container exists, check if it's running
      if (container.State !== 'running') {
        const containerInstance = docker.getContainer(container.Id);
        await containerInstance.start();
      }
      return container.Id;
    }
    
    // Pull image if needed
    await docker.pull(config.image);
    
    // Create new container
    const containerConfig = {
      Image: config.image,
      name: config.containerName,
      Cmd: ['/bin/sh'],
      WorkingDir: '/app',
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      HostConfig: {
        Memory: 512 * 1024 * 1024, // 512MB memory limit
        MemorySwap: 512 * 1024 * 1024, // Disable swap
        CpuPeriod: 100000,
        CpuQuota: 50000, // Limit to 50% CPU
        NetworkMode: 'none', // Disable network access
        Binds: ['./tmp:/app'],
        SecurityOpt: ['no-new-privileges'],
        CapDrop: ['ALL'],
      },
    };
    
    const newContainer = await docker.createContainer(containerConfig);
    await newContainer.start();
    return newContainer.id;
  } catch (error) {
    console.error(`Error ensuring container for ${language}:`, error);
    throw error;
  }
}

async function startCompilers() {
  try {
    console.log('Starting compiler containers...');
    
    // Create tmp directory if it doesn't exist
    await execAsync('mkdir -p tmp');
    
    // Start containers for each language
    for (const language of Object.keys(LANGUAGE_CONFIGS) as Array<keyof typeof LANGUAGE_CONFIGS>) {
      await ensureContainer(language);
      console.log(`Started ${language} compiler container`);
    }
    
    console.log('All compiler containers are running');
  } catch (error) {
    console.error('Error starting compilers:', error);
    process.exit(1);
  }
}

async function stopCompilers() {
  try {
    console.log('Stopping compiler containers...');
    
    // Stop containers for each language
    for (const config of Object.values(LANGUAGE_CONFIGS)) {
      const containers = await docker.listContainers();
      const container = containers.find(c => c.Names.includes(`/${config.containerName}`));
      
      if (container) {
        const containerInstance = docker.getContainer(container.Id);
        await containerInstance.stop();
        await containerInstance.remove();
        console.log(`Stopped and removed ${config.containerName}`);
      }
    }
    
    console.log('All compiler containers stopped');
  } catch (error) {
    console.error('Error stopping compilers:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'start':
    startCompilers();
    break;
  case 'stop':
    stopCompilers();
    break;
  default:
    console.log('Usage: ts-node scripts/manage-compiler.ts [start|stop]');
    process.exit(1);
} 