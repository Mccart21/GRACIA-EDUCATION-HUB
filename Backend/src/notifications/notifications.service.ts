import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async create(
    userId: number,
    title: string,
    message: string,
    type: string,
    actionUrl: string | null = null,
  ) {
    const notification = this.notificationsRepository.create({
      userId,
      title,
      message,
      type,
      actionUrl,
      status: 'unread',
    });

    return this.notificationsRepository.save(notification);
  }

  async findMyNotifications(userId: number) {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(userId: number, notificationId: number) {
    const notification = await this.notificationsRepository.findOne({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.status = 'read';

    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: number) {
    await this.notificationsRepository.update(
      { userId, status: 'unread' },
      { status: 'read' },
    );

    return {
      message: 'All notifications marked as read',
    };
  }
}