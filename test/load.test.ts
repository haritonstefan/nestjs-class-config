import { IsNotEmpty, IsNumber, IsString, } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../src';

test('Should create an instance of the config class with the user property read from the env.', async () => {
    class Config {
        @IsString()
        @Expose({ name: 'USER' })
        public user: string;
    }

    const module = Test.createTestingModule({
        imports: [
            ConfigModule.registerAsync({
                class: Config,
            })
        ]
    })

    const compiled = await module.compile();
    const config = compiled.get(Config);
    expect(config.user).toBe(process.env.USER);
});

test('Should not create an instance of the config class if there are missing fields in the env.', async () => {
    class Config {
        @IsString()
        @IsNotEmpty()
        @Expose({ name: 'should_not_exist' })
        public should_not_exist: string;
    }

    const module = Test.createTestingModule({
        imports: [
            ConfigModule.registerAsync({
                class: Config,
            })
        ]
    })
    expect.assertions(1);

    await expect(module.compile()).rejects.toEqual([{
        "children": [],
        "constraints": {
            "isNotEmpty": "should_not_exist should not be empty",
            "isString": "should_not_exist must be a string"
        },
        "property": "should_not_exist",
        "target": { "should_not_exist": undefined },
        "value": undefined
    }]);
});

test('Should transform number value properly.', async () => {
    const expectedValue = 123;
    process.env.int = expectedValue.toString();

    class Config {
        @Expose({ name: 'int' })
        @IsNumber()
        @Type(() => Number)
        public int: string;
    }

    const module = Test.createTestingModule({
        imports: [
            ConfigModule.registerAsync({
                class: Config,
            })
        ]
    })

    const compiled = await module.compile();
    const config = compiled.get(Config);
    expect(config.int).toBe(expectedValue);
})