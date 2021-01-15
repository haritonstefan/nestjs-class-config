import { DynamicModule, Module } from '@nestjs/common';
import { loadSync, load } from 'class-config';

export declare type ClassType<T> = {
    new (...args: any[]): T;
};

export interface ConfigModuleOptions {
    class: ClassType<any>
    global?: boolean
}

@Module({})
export class ConfigModule {
    static register(options: ConfigModuleOptions): DynamicModule {
        const Cls: ClassType<any> = options.class;
        const instance = loadSync(Cls);

        return {
            global: options.global,
            module: ConfigModule,
            providers: [{ provide: Cls, useValue: instance }],
            exports: [Cls]
        }
    }

    static async registerAsync(options: ConfigModuleOptions): Promise<DynamicModule> {
        const Cls: ClassType<any> = options.class;
        const instance = await load(Cls);

        return {
            global: options.global,
            module: ConfigModule,
            providers: [{ provide: Cls, useValue: instance }],
            exports: [Cls]
        }
    }
}