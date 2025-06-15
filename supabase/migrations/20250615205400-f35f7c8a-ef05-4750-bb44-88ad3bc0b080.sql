
-- Create water settings table for landlords to set unit prices per property
CREATE TABLE public.water_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(property_id)
);

-- Create water readings table for caretakers to input meter readings
CREATE TABLE public.water_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  previous_reading NUMERIC(10,2) NOT NULL DEFAULT 0,
  current_reading NUMERIC(10,2) NOT NULL,
  units_consumed NUMERIC(10,2) GENERATED ALWAYS AS (current_reading - previous_reading) STORED,
  reading_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create water bills table for tracking invoices
CREATE TABLE public.water_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  reading_id UUID REFERENCES public.water_readings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  units_consumed NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE NOT NULL,
  bill_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for water_settings
ALTER TABLE public.water_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own water settings" 
  ON public.water_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own water settings" 
  ON public.water_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water settings" 
  ON public.water_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for water_readings
ALTER TABLE public.water_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view water readings for their properties" 
  ON public.water_readings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create water readings" 
  ON public.water_readings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update water readings" 
  ON public.water_readings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for water_bills
ALTER TABLE public.water_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view water bills for their properties" 
  ON public.water_bills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Tenants can view their own water bills"
  ON public.water_bills
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants t 
      WHERE t.id = tenant_id 
      AND t.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can create water bills" 
  ON public.water_bills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update water bills" 
  ON public.water_bills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_water_settings_property_id ON public.water_settings(property_id);
CREATE INDEX idx_water_readings_tenant_id ON public.water_readings(tenant_id);
CREATE INDEX idx_water_readings_property_id ON public.water_readings(property_id);
CREATE INDEX idx_water_readings_date ON public.water_readings(reading_date);
CREATE INDEX idx_water_bills_tenant_id ON public.water_bills(tenant_id);
CREATE INDEX idx_water_bills_property_id ON public.water_bills(property_id);
CREATE INDEX idx_water_bills_status ON public.water_bills(status);
