export const gmailSearchFilterNonPersonalEmails =
  'noreply|no-reply|do_not_reply|no.reply|accounts@|info@|admin@|contact@|hello@|support@|sales@|feedback@|service@|help@|mailer-daemon|notifications|digest|auto|apps|assign|comments|customer-success|enterprise|esign|express|forum|gc@|learn|mailer|marketing|messages|news|notification|payments|receipts|recrutement|security|service|support|team';

export const gmailSearchFilterExcludeEmails = (emails: string[]): string => {
  return `from:-(${gmailSearchFilterNonPersonalEmails}|${emails.join(
    '|',
  )}) to:-(${gmailSearchFilterNonPersonalEmails}|${emails.join('|')})`;
};
