export interface ChangePassword {
  userId: string;
  newPassword: string;
  currentPassword: string;
}

export interface UpdateProfile {
  name: string;
  email: string;
  userId: string;
}
