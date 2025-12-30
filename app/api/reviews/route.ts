import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

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
      { error: 'Erreur lors de l\'enregistrement de l\'avis', details: error.message },
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

    let query = supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name
        )
      `);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des avis' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
















