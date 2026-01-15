import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const today = new Date();

        // Fetch tenants who are active and whose rent is due today
        const { data: tenants, error } = await supabaseClient
            .from('tenants')
            .select(`
                id,
                unit_id,
                profiles(id, email),
                units(monthly_rent)
            `)
            .eq('is_active', true)
            .not('unit_id', 'is', null) // only tenants with assigned unit
        if (error) throw error;

        let sentCount = 0;

        for (const tenant of tenants) {
            const tenantEmail = tenant.profiles?.email;
            const tenantProfileId = tenant.profiles?.id;
            const rentAmount = tenant.units?.monthly_rent || "N/A";

            if (!tenantEmail || !tenantProfileId) continue;

            // Placeholder for email sending / external integration
            console.log(`Sending rent reminder to ${tenantEmail} for ${rentAmount} FCFA`);

            // Insert notification record
            await supabaseClient.from('notifications').insert({
                user_id: tenantProfileId,
                title: "Rent Due",
                message: `Your rent of ${rentAmount} FCFA is due today.`,
                type: "reminder",
                read: false
            });

            sentCount++;
        }

        return new Response(JSON.stringify({ message: `Reminders sent to ${sentCount} tenants` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
