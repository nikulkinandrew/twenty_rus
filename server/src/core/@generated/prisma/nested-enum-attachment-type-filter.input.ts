import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AttachmentType } from './attachment-type.enum';

@InputType()
export class NestedEnumAttachmentTypeFilter {

    @Field(() => AttachmentType, {nullable:true})
    equals?: keyof typeof AttachmentType;

    @Field(() => [AttachmentType], {nullable:true})
    in?: Array<keyof typeof AttachmentType>;

    @Field(() => [AttachmentType], {nullable:true})
    notIn?: Array<keyof typeof AttachmentType>;

    @Field(() => NestedEnumAttachmentTypeFilter, {nullable:true})
    not?: NestedEnumAttachmentTypeFilter;
}
