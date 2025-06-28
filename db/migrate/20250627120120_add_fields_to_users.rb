class AddFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :phone, :string
    add_column :users, :active, :boolean, default: true, null: false
    add_column :users, :last_login_at, :datetime
    
    # Add constraints to existing columns
    change_column_null :users, :email, false
    change_column_null :users, :name, false
    change_column_null :users, :role, false
    
    # Add indexes
    add_index :users, :email, unique: true
    add_index :users, :role
    add_index :users, :active
  end
end 