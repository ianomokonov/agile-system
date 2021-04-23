export interface UserShortView {
  id: number;
  name: string;
  surname: string;
  email: string;
  image: string;
  isMy: boolean;
  isOwner: boolean;

  roleIds?: number[];
}
