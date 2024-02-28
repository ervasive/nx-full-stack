import { TransNoContext, TransProps } from '@lingui/react/server';
import { getI18n } from './get-i18n';

export async function Trans(props: TransProps) {
  const i18n = await getI18n();
  return <TransNoContext {...props} lingui={{ i18n }} />;
}
