export const auth = async (credentials: {
  email: string;
  password: string;
}) => {
  const { email, password } = credentials;

  try {
    const {
      error,
      data: { user },
    } = await window.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error?.code === 'invalid_credentials') {
      await window.supabase.auth.signUp({ email, password });

      await auth({ email, password });
    }

    return user;
  } catch (e) {
    console.log(e);
  }
};
