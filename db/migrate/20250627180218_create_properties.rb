class CreateProperties < ActiveRecord::Migration[7.1]
  def change
    create_table :properties do |t|
      t.string :name
      t.string :address
      t.string :property_type
      t.string :status

      t.timestamps
    end
  end
end
