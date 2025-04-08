import { ExecutionResult } from '@/types/compiler';

class DockerCompilerService {
  private static instance: DockerCompilerService;
  private readonly API_ENDPOINT = process.env.NEXT_PUBLIC_COMPILER_API_URL;

  private constructor() {
    console.log('Initializing Docker compiler service...');
  }

  public static getInstance(): DockerCompilerService {
    if (!DockerCompilerService.instance) {
      DockerCompilerService.instance = new DockerCompilerService();
    }
    return DockerCompilerService.instance;
  }

  async createContainer(language: string): Promise<string> {
    // Simulate container creation
    return `container_${Math.random().toString(36).substring(7)}`;
  }

  async executeCode(containerId: string, code: string, input: string): Promise<ExecutionResult> {
    try {
      const response = await fetch(this.API_ENDPOINT as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, input }),
      });

      if (!response.ok) {
        throw new Error('Execution failed');
      }

      const result = await response.json();
      return {
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
      };
    } catch (error) {
      return {
        output: '',
        error: 'Container execution failed',
        executionTime: 0,
        memoryUsed: 0,
      };
    }
  }

  async removeContainer(containerId: string): Promise<void> {
    // Simulate container cleanup
    console.log(`Removing container ${containerId}`);
  }
}

export const dockerCompiler = DockerCompilerService.getInstance();
