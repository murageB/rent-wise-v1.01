class RentPayment < ApplicationRecord
  belongs_to :tenant
  belongs_to :unit
end
