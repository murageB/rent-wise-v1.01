class Tenant < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :unit, optional: true
  has_many :maintenance_requests, dependent: :destroy
  has_many :rent_payments, dependent: :destroy
  has_many :water_bills, dependent: :destroy
end 