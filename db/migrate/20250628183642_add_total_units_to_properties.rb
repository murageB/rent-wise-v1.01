class AddTotalUnitsToProperties < ActiveRecord::Migration[7.1]
  def change
    add_column :properties, :total_units, :integer
  end
end
