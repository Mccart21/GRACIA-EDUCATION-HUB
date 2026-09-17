import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TeachersModule } from './teachers/teachers.module';
import { TutorsModule } from './tutors/tutors.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PaymentsModule } from './payments/payments.module';
import { ContactModule } from './contact/contact.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'oracle',

        host: config.get<string>('DB_HOST'),

        port: Number(
          config.get<string>('DB_PORT'),
        ),

        username: config.get<string>('DB_USERNAME'),

        password: config.get<string>('DB_PASSWORD'),

        connectString:
          `${config.get<string>('DB_HOST')}:` +
          `${config.get<string>('DB_PORT')}/` +
          `${config.get<string>('DB_SERVICE_NAME')}`,

        autoLoadEntities: true,

        synchronize: false,

        logging: false,
      }),
    }),

    AuthModule,
    UsersModule,
    CoursesModule,
    SubjectsModule,
    TeachersModule,
    TutorsModule,
    SubscriptionsModule,
    EnrollmentsModule,
    PaymentsModule,
    ContactModule,
    FeedbackModule,
  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule {}