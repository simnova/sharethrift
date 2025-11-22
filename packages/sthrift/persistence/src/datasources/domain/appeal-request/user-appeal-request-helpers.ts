import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { PersonalUserDomainAdapter } from '../user/personal-user/personal-user.domain-adapter.ts';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';

export function getUser(doc: { user: unknown; set: (field: string, value: unknown) => void }): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference {
  if (!doc.user) {
    throw new Error('user is not populated');
  }
  if (doc.user instanceof MongooseSeedwork.ObjectId) {
    throw new Error('user is not populated');
  }
  const adapter = new PersonalUserDomainAdapter(
    doc.user as Models.User.PersonalUser,
  );
  return adapter.entityReference as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
}

export async function loadUser(doc: { user: unknown; populate: (field: string) => Promise<void> }): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference> {
  if (!doc.user) {
    throw new Error('user is not populated');
  }
  if (doc.user instanceof MongooseSeedwork.ObjectId) {
    await doc.populate('user');
  }
  const adapter = new PersonalUserDomainAdapter(
    doc.user as Models.User.PersonalUser,
  );
  return adapter.entityReference as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
}

export function setUser(
  doc: { set: (field: string, value: unknown) => void },
  user: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>
) {
  if (!user?.id) {
    throw new Error('user reference is missing id');
  }
  doc.set('user', new MongooseSeedwork.ObjectId(user.id));
}
