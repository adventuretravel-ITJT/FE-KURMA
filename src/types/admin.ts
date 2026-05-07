export interface Permission {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description?: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface PermissionGroup {
  module: string;
  permissions: Permission[];
}
