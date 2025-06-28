class AddReconnectionFeeAndDisconnectedToWaterBills < ActiveRecord::Migration[7.1]
  def change
    add_column :water_bills, :reconnection_fee, :decimal
    add_column :water_bills, :disconnected, :boolean
  end
end
