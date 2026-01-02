import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Niet geauthenticeerd' },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
    const { data: existingReviews, error: checkError } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .limit(1);

    const existingReview = existingReviews && existingReviews.length > 0 ? existingReviews[0] : null;

    let review;
    if (existingReview) {
      // Mettre à jour l'avis existant
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          comment: comment || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingReview.id)
        .select()
        .single();

      if (error) throw error;
      review = data;
    } else {
      // Créer un nouvel avis
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: productId,
          rating,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      review = data;
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: 'Fout bij het opslaan van de beoordeling', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');

    // Construire la requête de base
    let query = supabase
      .from('reviews')
      .select('*');

    if (productId) {
      query = query.eq('product_id', productId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: reviews, error: reviewsError } = await query.order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return NextResponse.json(
        { error: 'Fout bij het ophalen van beoordelingen', details: reviewsError.message },
        { status: 500 }
      );
    }

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ reviews: [] });
    }

    // Récupérer les profils pour tous les user_id uniques
    const userIds = [...new Set(reviews.map((r: any) => r.user_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', userIds);

    // Créer une map pour accéder rapidement aux profils
    const profilesMap = new Map();
    if (profiles && !profilesError) {
      profiles.forEach((profile: any) => {
        profilesMap.set(profile.id, profile);
      });
    }

    // Combiner les avis avec leurs profils
    const reviewsWithProfiles = reviews.map((review: any) => ({
      ...review,
      profiles: profilesMap.get(review.user_id) || null
    }));

    return NextResponse.json({ reviews: reviewsWithProfiles });
  } catch (error: any) {
    console.error('Unexpected error in GET reviews:', error);
    return NextResponse.json(
      { error: 'Er is een onverwachte fout opgetreden', details: error.message },
      { status: 500 }
    );
  }
}
















