class Admin::SessionsController < ApplicationController
  ADMIN_EMAIL = 'admin@rentwise.com'
  ADMIN_PASSWORD = 'R3ntW1S3'
  ADMIN_SESSION_TIMEOUT = 1.hour

  def create
    log_admin_attempt
    if params[:password] == ADMIN_PASSWORD
      session[:admin_logged_in] = true
      session[:admin_logged_in_at] = Time.current
      ensure_admin_user_exists
      redirect_to admin_articles_path, notice: "Admin logged in successfully."
    else
      flash[:admin_alert] = "Invalid admin password."
      redirect_to new_user_session_path
    end
  end

  private

  def log_admin_attempt
    Rails.logger.info "Admin login attempt at #{Time.current} from IP: #{request.remote_ip}"
  end

  def ensure_admin_user_exists
    unless User.exists?(email: ADMIN_EMAIL)
      User.create!(email: ADMIN_EMAIL, password: ADMIN_PASSWORD, password_confirmation: ADMIN_PASSWORD, role: 'admin', name: 'Admin')
    end
  end
end 