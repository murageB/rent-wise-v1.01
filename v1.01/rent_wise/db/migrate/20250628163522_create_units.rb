class CreateUnits < ActiveRecord::Migration[7.1]
  def change
    create_table :units do |t|
      t.references :property, null: false, foreign_key: true
      t.string :unit_number
      t.string :unit_type
      t.decimal :rent_amount
      t.boolean :occupied

      t.timestamps
    end
  end
end
