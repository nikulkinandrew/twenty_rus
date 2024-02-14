export enum SettingsPath {
  ProfilePage = 'profile',
  Appearance = 'profile/appearance',
  Accounts = 'accounts',
  NewAccount = 'accounts/new',
  AccountsEmails = 'accounts/emails',
  AccountsEmailsInboxSettings = 'accounts/emails/:accountUuid',
  Objects = 'objects',
  ObjectDetail = 'objects/:objectSlug',
  ObjectEdit = 'objects/:objectSlug/edit',
  ObjectNewFieldStep1 = 'objects/:objectSlug/new-field/step-1',
  ObjectNewFieldStep2 = 'objects/:objectSlug/new-field/step-2',
  ObjectFieldEdit = 'objects/:objectSlug/:fieldSlug',
  NewObject = 'objects/new',
  WorkspaceMembersPage = 'workspace-members',
  Workspace = 'workspace',
  Developers = '',
  DevelopersNewApiKey = 'api-keys/new',
  DevelopersApiKeyDetail = 'api-keys/:apiKeyId',
  Integrations = 'integrations',
  DevelopersNewWebhook = 'webhooks/new',
  DevelopersNewWebhookDetail = 'webhooks/:webhookId',
}
