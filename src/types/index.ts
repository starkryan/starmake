export interface RedeemRequest {
  id: string;
  salary_code_id: string;
  user_name: string;
  user_phone: string;
  upi_id: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  salary_codes?: {
    code: string;
    task: string;
    price: number;
  }[];
}

export interface TaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  submission_proof: {
    proof: string;
    additional_notes?: string;
    image_url?: string;
    submitted_at: string;
  };
  status: string;
  admin_notes?: string;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  tasks?: {
    title: string;
    task_type: string;
    price: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  price: number;
  is_free: boolean;
  mb_limit: number | null;
  requirements: any;
  status: string;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    role?: string;
  };
}
