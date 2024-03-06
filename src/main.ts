import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Compression from 'compression';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { configService } from '@services/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions-filter';
import { SpelunkerModule } from 'nestjs-spelunker';

async function initializeSpelunker(app: INestApplication) {
  const tree = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);
  console.log('graph LR');
  const mermaidEdges = edges.map(
    ({ from, to }) => `  ${from.module.name}-->${to.module.name}`,
  );
  // console.log(mermaidEdges.join('\n'));
}

async function initialize() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    abortOnError: false,
  });

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.use(Compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const options = new DocumentBuilder()
    .setTitle('HashIQ-Server')
    .setDescription('HashIQ-Server API')
    .setVersion('1.0')
    .addTag('HashIQ-Server')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  // initializeSpelunker(app);

  const port = configService.getPort();

  await app.listen(port, '0.0.0.0', () => {
    Logger.log(`Ready to use at Port: ${port} 🚀`, 'NestApplication');
  });
}
initialize();
