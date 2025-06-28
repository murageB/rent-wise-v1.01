class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_secure_password

  # Enums
  enum role: { tenant: 'tenant', caretaker: 'caretaker', landlord: 'landlord' }

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :role, presence: true, inclusion: { in: roles.keys }
  validates :phone, format: { with: /\A\+?[\d\s\-\(\)]+\z/ }, allow_blank: true

  # Scopes
  scope :active, -> { where(active: true) }
  scope :by_role, ->(role) { where(role: role) }

  # Callbacks
  before_save :downcase_email

  # Instance methods
  def landlord?
    role == 'landlord'
  end

  def caretaker?
    role == 'caretaker'
  end

  def tenant?
    role == 'tenant'
  end

  def full_name
    name
  end

  def display_role
    role.titleize
  end

  def update_last_login!
    update(last_login_at: Time.current)
  end

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end
end 