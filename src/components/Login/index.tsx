import { useLoginForm } from '@/hooks';

export const Login = () => {
  const {
    creds: { username, password },
    onPasswordChange,
    onUsernameChange,
    onEnterPress,
    onSubmit,
    disableBtn,
  } = useLoginForm();
  return (
    <div className="flex w-screen h-screen justify-center items-center flex-col">
      <form
        className="flex flex-col gap-4 max-w-sm w-full p-4 bg-base-100 rounded-box shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h1 className="text-4xl font-bold text-center mb-4">Login</h1>
        <div className="form-control">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onUsernameChange}
              onKeyDown={onEnterPress}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onPasswordChange}
              onKeyDown={onEnterPress}
            />
          </label>
        </div>
        <button
          className="btn btn-primary w-full"
          disabled={disableBtn}
          onClick={onSubmit}
        >
          Login
        </button>
      </form>
    </div>
  );
};
