require "test_helper"

class PropertiesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  
  setup do
    @property = properties(:one)
    @user = users(:one)
    sign_in @user
  end

  test "should get index" do
    get properties_url
    assert_response :success
  end

  test "should get new" do
    get new_property_url
    assert_response :success
  end

  test "should create property" do
    assert_difference("Property.count") do
      post properties_url, params: { property: { address: @property.address, name: "New Property", property_type: @property.property_type, status: @property.status } }
    end

    assert_redirected_to property_url(Property.last)
  end

  test "should show property" do
    get property_url(@property)
    assert_response :success
  end

  test "should get edit" do
    get edit_property_url(@property)
    assert_response :success
  end

  test "should update property" do
    patch property_url(@property), params: { property: { address: @property.address, name: "Updated Property", property_type: @property.property_type, status: @property.status } }
    assert_redirected_to property_url(@property)
  end

  test "should destroy property" do
    # Create a property without units to ensure it can be deleted
    property_to_delete = Property.create!(name: "Test Property", address: "Test Address", property_type: "House", status: "Active")
    
    assert_difference("Property.count", -1) do
      delete property_url(property_to_delete)
    end

    assert_redirected_to properties_url
  end

  test "should require authentication" do
    sign_out @user
    get properties_url
    assert_redirected_to new_user_session_url
  end
end
