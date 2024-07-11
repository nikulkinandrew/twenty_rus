import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { JwtAuthGuard } from 'src/engine/guards/jwt.auth.guard';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { User } from 'src/engine/core-modules/user/user.entity';
import { FunctionService } from 'src/engine/core-modules/function/function.service';
import { ExecuteFunctionInput } from 'src/engine/core-modules/function/dtos/execute-function.input';

@UseGuards(JwtAuthGuard)
@Resolver(() => String)
export class FunctionResolver {
  constructor(private readonly functionService: FunctionService) {}

  @Mutation(() => String)
  async upsertFunction(
    @AuthUser() user: User,
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
    @Args('name', { type: () => String }) name: string,
  ) {
    return await this.functionService.upsertFunction(user, file, name);
  }

  @Mutation(() => String)
  async executeFunction(
    @AuthUser() user: User,
    @Args() executeFunctionInput: ExecuteFunctionInput,
  ) {
    const { name, payload } = executeFunctionInput;

    return JSON.stringify(
      await this.functionService.executeFunction(user, name, payload),
    );
  }
}
