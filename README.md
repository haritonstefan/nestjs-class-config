# nestjs-class-config

A module for handling configuration of nestjs applications. It reads and validates the process.env using class-validator
and class-transformer and exposes the instance of validated class containing the configuration to the Nestjs DI.

## Example
This is the most common example when there is the need of an app wide config.
Optionally, you can define specific classes for different parts of the app and import the ConfigModule in the specific parts.
```typescript
// assuming there are the following values in process.env
process.env.USER = 'ADMIN';
process.env.APP_PORT = '1234';
process.env.APP_HOST = '0.0.0.0';

import { ConfigModule } from 'nestjs-class-config';

// The class name can be different
class Config {
    @IsString() //  Checks the value is a string
    @IsNotEmpty() // Not empty
    @Expose({ name: 'USER' }) // Reading it from process.env.USER property
    public user: string;

    @IsNumber() // Checks that the value is a number, or a string represented number
    @Type(() => Number)
    @Expose({ name: 'APP_PORT' }) // Reading it from process.env.APP_PORT property
    public appPort: number;

    @IsIP() // Checks that the value is an IP
    @Expose({ name: 'APP_HOST' }) // Reading it from process.env.APP_HOST
    public appHost: string;
}

@Module({
    imports: [
        ConfigModule.register({ 
            class: Config,
            global: true // Marks this specific config to be available accorss the app
        })
    ],
    controllers: [AppController]
})
export class AppModule {
}


export class AppController {
    constructor(
        private readonly config: Config // Injecting the config instance
    ) {
    }

    @Get('/config')
    @HttpCode(200)
    host(): Map<string, string> {
        return {
            user: this.config.user,
            host: this.config.appHost,
            port: this.config.appPort,
        }
    }
}
```