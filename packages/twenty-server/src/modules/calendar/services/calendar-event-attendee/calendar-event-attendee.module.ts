import { Module } from '@nestjs/common';

import { ObjectMetadataRepositoryModule } from 'src/engine/object-metadata-repository/object-metadata-repository.module';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { CalendarEventAttendeeService } from 'src/modules/calendar/services/calendar-event-attendee/calendar-event-attendee.service';
import { GetEmailPersonIdAndWorkspaceMemberIdMapModule } from 'src/modules/connected-account/services/get-email-person-and-workspace-member-id-map/get-email-person-id-and-workspace-member-id-map.module';
import { PersonObjectMetadata } from 'src/modules/person/standard-objects/person.object-metadata';

@Module({
  imports: [
    WorkspaceDataSourceModule,
    ObjectMetadataRepositoryModule.forFeature([PersonObjectMetadata]),
    GetEmailPersonIdAndWorkspaceMemberIdMapModule,
  ],
  providers: [CalendarEventAttendeeService],
  exports: [CalendarEventAttendeeService],
})
export class CalendarEventAttendeeModule {}
