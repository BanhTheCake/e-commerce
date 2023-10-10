import { Users } from '@/entities';
import { NodemailerService } from '@app/shared';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { generateHtml } from '@/utils/generateHtml';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<Users> {
  constructor(
    dataSource: DataSource,
    private nodemailerService: NodemailerService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Users;
  }

  afterInsert(event: InsertEvent<Users>) {
    console.log(`AFTER USER INSERTED: `, event.entity.email);
    const html = generateHtml({
      username: event.entity.username,
      linkToActive:
        'http://localhost:3000/active?token=' +
        [event.entity.id, event.entity.activeToken].join('.'),
      label: 'active',
    });
    this.nodemailerService.sendEmail({
      to: event.entity.email,
      subject: 'BanhTheCake - Active your account',
      html: html,
    });
  }
}
