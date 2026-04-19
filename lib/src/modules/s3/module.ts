import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3"
import { DynamicModule, FactoryProvider, Module, ModuleMetadata } from "@nestjs/common"

export const S3_CLIENT = Symbol("S3_CLIENT")

const S3_OPTIONS = Symbol("S3_OPTIONS")

interface S3ModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: FactoryProvider["inject"]
  useFactory: (...args: any[]) => S3ClientConfig | Promise<S3ClientConfig>
}

@Module({})
export class S3Module {
  static register({ ...config }: S3ClientConfig): DynamicModule {
    return {
      module: S3Module,
      global: true,
      providers: [
        { provide: S3_OPTIONS, useValue: config },
        {
          provide: S3_CLIENT,
          inject: [S3_OPTIONS],
          useFactory: (opts: S3ClientConfig) => new S3Client(opts)
        }
      ],
      exports: [S3_CLIENT]
    }
  }

  static registerAsync({ imports, inject, useFactory }: S3ModuleAsyncOptions): DynamicModule {
    return {
      module: S3Module,
      global: true,
      imports: imports ?? [],
      providers: [
        {
          provide: S3_OPTIONS,
          inject: inject ?? [],
          useFactory
        },
        {
          provide: S3_CLIENT,
          inject: [S3_OPTIONS],
          useFactory: (opts: S3ClientConfig) => new S3Client(opts)
        }
      ],
      exports: [S3_CLIENT]
    }
  }
}
