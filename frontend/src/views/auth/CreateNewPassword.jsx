import { useState, useEffect } from "react";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import apiInstance from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../plugin/Toast";
import { combine } from "zustand/middleware";


function CreateNewPassword() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const { uidb64, token } = useParams(); 

	const handleCreatePassword = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (confirmPassword !== password) {
			Toast().fire({icon: "warning", title: "Passwords does not match"});
			return;
		} 

		try {					
			const response = await apiInstance.post(`/auth/password/reset/confirm/`, {
				uid: uidb64,
				token: token,
				new_password1: password,
				new_password2: confirmPassword,
			});

			console.log(response.data);
			Toast().fire({icon: "success", title: "Password has been reset!"});
			navigate("/login/");
		} catch (error) {
			console.log(error);
			Toast().fire({icon: "error",title: "Failed to reset password"});
		} finally {
			setIsLoading(false);
		}
    
  };
  return (
    <>
      <BaseHeader />

      <section
        className="container d-flex flex-column vh-100"
        style={{ marginTop: "150px" }}
      >
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Create New Password</h1>
                  <span>Choose a new password for your account</span>
                </div>
                <form
                  className="needs-validation"
                  noValidate=""
                  onSubmit={handleCreatePassword}
                >
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Enter New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="**************"
                      required=""
                      autoComplete="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter valid password.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="**************"
                      required=""
                      autoComplete="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter valid password.
                    </div>
                  </div>

                  <div>
                    <div className="d-grid">
                      {isLoading === true && (
                        <button
                          disabled
                          type="submit"
                          className="btn btn-primary"
                        >
                          Processing <i className="fas fa-spinner fa-spin"></i>
                        </button>
                      )}

                      {isLoading === false && (
                        <button type="submit" className="btn btn-primary">
                          Save New Password{" "}
                          <i className="fas fa-check-circle"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BaseFooter />
    </>
  );
}

export default CreateNewPassword;
