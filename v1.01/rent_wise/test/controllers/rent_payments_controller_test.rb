require "test_helper"

class RentPaymentsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get rent_payments_index_url
    assert_response :success
  end

  test "should get show" do
    get rent_payments_show_url
    assert_response :success
  end

  test "should get new" do
    get rent_payments_new_url
    assert_response :success
  end

  test "should get edit" do
    get rent_payments_edit_url
    assert_response :success
  end
end
