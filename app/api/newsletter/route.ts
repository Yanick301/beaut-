import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Table newsletter (à créer dans Supabase)
// CREATE TABLE IF NOT EXISTS public.newsletter (
//   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//   email TEXT UNIQUE NOT NULL,
//   name TEXT,
//   subscribed BOOLEAN DEFAULT true,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
// );

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 }
      );
    }

    // Pour l'instant, on peut juste log ou envoyer à un service externe
    // Vous pouvez créer une table newsletter dans Supabase si nécessaire
    console.log('Newsletter subscription:', { email, name });

    // Simuleer een succesvolle inschrijving
    return NextResponse.json({ 
      success: true, 
      message: 'U bent nu ingeschreven op onze nieuwsbrief!' 
    });

    // Si vous voulez sauvegarder dans Supabase :
    /*
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('newsletter')
      .upsert({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        subscribed: true,
      });

    if (error) {
      if (error.code === '23505') { // Already subscribed
        return NextResponse.json({ 
          success: true, 
            message: 'U bent al ingeschreven op onze nieuwsbrief!' 
        });
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Vous êtes maintenant inscrit(e) à notre newsletter !' 
    });
    */
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Fout bij het inschrijven voor de nieuwsbrief' },
      { status: 500 }
    );
  }
}
















