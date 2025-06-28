class Tenant < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :unit, optional: true
  has_many :maintenance_requests
  has_many :rent_payments
end 