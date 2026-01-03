import json

products_data = {
    'soins-visage': [
        {'name': 'Buffet', 'brand': 'The Ordinary', 'price': 24.90, 'desc': 'Sérum multi-peptides pour réduire les signes de l\'âge', 'sub': 'Sérums'},
        {'name': 'Niacinamide 10% + Zinc 1%', 'brand': 'The Ordinary', 'price': 25.90, 'desc': 'Sérum niacinamide pour minimiser les pores', 'sub': 'Sérums'},
        {'name': 'Hyaluronic Acid 2% + B5', 'brand': 'The Ordinary', 'price': 22.90, 'desc': 'Sérum acide hyaluronique hydratant', 'sub': 'Sérums'},
        {'name': 'Retinol 1% in Squalane', 'brand': 'The Ordinary', 'price': 28.90, 'desc': 'Sérum rétinol anti-âge', 'sub': 'Sérums'},
        {'name': 'Vitamin C Suspension 23% + HA Spheres 2%', 'brand': 'The Ordinary', 'price': 26.90, 'desc': 'Sérum vitamine C éclat', 'sub': 'Sérums'},
        {'name': 'AHA 30% + BHA 2% Peeling Solution', 'brand': 'The Ordinary', 'price': 29.90, 'desc': 'Masque peeling exfoliant', 'sub': 'Masques'},
        {'name': 'Revitalift Filler', 'brand': 'L\'Oréal Paris', 'price': 34.99, 'desc': 'Crème anti-âge repulpante', 'sub': 'Crèmes hydratantes'},
        {'name': 'Revitalift Laser X3', 'brand': 'L\'Oréal Paris', 'price': 39.99, 'desc': 'Crème anti-rides intensive', 'sub': 'Crèmes hydratantes'},
        {'name': 'Age Perfect Cell Renewal', 'brand': 'L\'Oréal Paris', 'price': 44.99, 'desc': 'Crème régénérante mature', 'sub': 'Crèmes hydratantes'},
        {'name': 'Hydra Genius', 'brand': 'L\'Oréal Paris', 'price': 32.99, 'desc': 'Crème hydratante légère', 'sub': 'Crèmes hydratantes'},
        {'name': 'Pure Hyaluronic Acid Serum', 'brand': 'The Inkey List', 'price': 23.90, 'desc': 'Sérum acide hyaluronique pur', 'sub': 'Sérums'},
        {'name': 'Retinol Serum', 'brand': 'The Inkey List', 'price': 24.90, 'desc': 'Sérum rétinol concentré', 'sub': 'Sérums'},
        {'name': 'Q10 Anti-Wrinkle Day Cream', 'brand': 'Nivea', 'price': 28.99, 'desc': 'Crème anti-rides jour', 'sub': 'Crèmes hydratantes'},
        {'name': 'Q10 Plus Anti-Age Night Cream', 'brand': 'Nivea', 'price': 29.99, 'desc': 'Crème anti-âge nuit', 'sub': 'Crèmes hydratantes'},
        {'name': 'Soft Moisturising Cream', 'brand': 'Nivea', 'price': 22.99, 'desc': 'Crème hydratante douce', 'sub': 'Crèmes hydratantes'},
        {'name': 'The Ritual of Namaste', 'brand': 'Rituals', 'price': 34.95, 'desc': 'Crème visage ayurvédique', 'sub': 'Crèmes hydratantes'},
        {'name': 'The Ritual of Sakura', 'brand': 'Rituals', 'price': 32.95, 'desc': 'Crème hydratante cerisier', 'sub': 'Crèmes hydratantes'},
        {'name': 'The Ritual of Karma', 'brand': 'Rituals', 'price': 36.95, 'desc': 'Crème anti-âge karma', 'sub': 'Crèmes hydratantes'},
        {'name': 'Micellar Cleansing Water', 'brand': 'Garnier', 'price': 21.99, 'desc': 'Eau micellaire nettoyante', 'sub': 'Nettoyants'},
        {'name': 'Micellar Cleansing Gel', 'brand': 'Garnier', 'price': 22.99, 'desc': 'Gel nettoyant micellaire', 'sub': 'Nettoyants'},
        {'name': 'Vitamin C Brightening Serum', 'brand': 'Garnier', 'price': 24.99, 'desc': 'Sérum vitamine C éclat', 'sub': 'Sérums'},
        {'name': 'Organic Argan Oil', 'brand': 'The Ordinary', 'price': 23.90, 'desc': 'Huile argan organique', 'sub': 'Sérums'},
        {'name': '100% Plant-Derived Squalane', 'brand': 'The Ordinary', 'price': 22.90, 'desc': 'Huile squalane végétale', 'sub': 'Sérums'},
        {'name': 'Natural Moisturizing Factors + HA', 'brand': 'The Ordinary', 'price': 21.90, 'desc': 'Crème hydratante naturelle', 'sub': 'Crèmes hydratantes'},
        {'name': 'Matrixyl 10% + HA', 'brand': 'The Ordinary', 'price': 27.90, 'desc': 'Sérum peptides anti-âge', 'sub': 'Sérums'},
        {'name': 'Argireline Solution 10%', 'brand': 'The Ordinary', 'price': 26.90, 'desc': 'Sérum anti-rides argireline', 'sub': 'Sérums'},
        {'name': 'Caffeine Solution 5% + EGCG', 'brand': 'The Ordinary', 'price': 25.90, 'desc': 'Sérum contour des yeux', 'sub': 'Sérums'},
        {'name': 'Lactic Acid 10% + HA', 'brand': 'The Ordinary', 'price': 24.90, 'desc': 'Sérum acide lactique', 'sub': 'Sérums'},
        {'name': 'Glycolic Acid 7% Toning Solution', 'brand': 'The Ordinary', 'price': 23.90, 'desc': 'Tonique acide glycolique', 'sub': 'Nettoyants'},
        {'name': 'Salicylic Acid 2% Solution', 'brand': 'The Ordinary', 'price': 22.90, 'desc': 'Sérum acide salicylique', 'sub': 'Sérums'},
    ],
    'maquillage': [
        {'name': 'True Match Foundation', 'brand': 'L\'Oréal Paris', 'price': 24.99, 'desc': 'Fond de teint correspondance parfaite', 'sub': 'Fond de teint'},
        {'name': 'Infallible 24H Fresh Wear', 'brand': 'L\'Oréal Paris', 'price': 29.99, 'desc': 'Fond de teint longue tenue 24h', 'sub': 'Fond de teint'},
        {'name': 'Age Perfect Foundation', 'brand': 'L\'Oréal Paris', 'price': 34.99, 'desc': 'Fond de teint mature', 'sub': 'Fond de teint'},
        {'name': 'Superstay Matte Ink', 'brand': 'Maybelline', 'price': 25.99, 'desc': 'Rouge à lèvres liquide mat', 'sub': 'Rouge à lèvres'},
        {'name': 'Color Sensational', 'brand': 'Maybelline', 'price': 22.99, 'desc': 'Rouge à lèvres sensation couleur', 'sub': 'Rouge à lèvres'},
        {'name': 'Lash Sensational Mascara', 'brand': 'Maybelline', 'price': 23.99, 'desc': 'Mascara cils sensationnels', 'sub': 'Mascara'},
        {'name': 'The Falsies Mascara', 'brand': 'Maybelline', 'price': 24.99, 'desc': 'Mascara volume faux cils', 'sub': 'Mascara'},
        {'name': 'Great Lash Mascara', 'brand': 'Maybelline', 'price': 21.99, 'desc': 'Mascara grand cils', 'sub': 'Mascara'},
        {'name': 'Fit Me! Foundation', 'brand': 'Maybelline', 'price': 22.99, 'desc': 'Fond de teint ajusté', 'sub': 'Fond de teint'},
        {'name': 'Master Precise Liquid Eyeliner', 'brand': 'Maybelline', 'price': 23.99, 'desc': 'Eyeliner liquide précis', 'sub': 'Fond de teint'},
        {'name': 'Colorama Nail Polish', 'brand': 'Maybelline', 'price': 21.99, 'desc': 'Vernis à ongles colorama', 'sub': 'Fond de teint'},
        {'name': 'Dream Satin Liquid Foundation', 'brand': 'Maybelline', 'price': 24.99, 'desc': 'Fond de teint liquide satin', 'sub': 'Fond de teint'},
        {'name': 'Instant Age Rewind Concealer', 'brand': 'Maybelline', 'price': 22.99, 'desc': 'Correcteur anti-âge', 'sub': 'Fond de teint'},
        {'name': 'Master Chrome Highlighter', 'brand': 'Maybelline', 'price': 25.99, 'desc': 'Highlighter chrome', 'sub': 'Highlighter'},
        {'name': 'The Blushed Nudes Palette', 'brand': 'Maybelline', 'price': 28.99, 'desc': 'Palette fards nude', 'sub': 'Palettes'},
        {'name': 'The Nudes Palette', 'brand': 'Maybelline', 'price': 27.99, 'desc': 'Palette nude', 'sub': 'Palettes'},
        {'name': 'Color Riche Lipstick', 'brand': 'L\'Oréal Paris', 'price': 23.99, 'desc': 'Rouge à lèvres riche couleur', 'sub': 'Rouge à lèvres'},
        {'name': 'Volume Million Lashes', 'brand': 'L\'Oréal Paris', 'price': 26.99, 'desc': 'Mascara million cils', 'sub': 'Mascara'},
        {'name': 'Telescopic Mascara', 'brand': 'L\'Oréal Paris', 'price': 27.99, 'desc': 'Mascara télescopique', 'sub': 'Mascara'},
        {'name': 'Liner Signature', 'brand': 'L\'Oréal Paris', 'price': 25.99, 'desc': 'Eyeliner signature', 'sub': 'Fond de teint'},
        {'name': 'Blush Subtil', 'brand': 'L\'Oréal Paris', 'price': 24.99, 'desc': 'Blush subtil', 'sub': 'Fond de teint'},
        {'name': 'Glow Paradise', 'brand': 'L\'Oréal Paris', 'price': 28.99, 'desc': 'Baume à lèvres teinté', 'sub': 'Rouge à lèvres'},
        {'name': 'Age Perfect Radiant Serum Foundation', 'brand': 'L\'Oréal Paris', 'price': 32.99, 'desc': 'Fond de teint sérum', 'sub': 'Fond de teint'},
        {'name': 'Infallible Pro-Matte Foundation', 'brand': 'L\'Oréal Paris', 'price': 29.99, 'desc': 'Fond de teint mat', 'sub': 'Fond de teint'},
        {'name': 'True Match Lumi Foundation', 'brand': 'L\'Oréal Paris', 'price': 26.99, 'desc': 'Fond de teint lumineux', 'sub': 'Fond de teint'},
        {'name': 'Infallible Pro-Last Lipstick', 'brand': 'L\'Oréal Paris', 'price': 24.99, 'desc': 'Rouge à lèvres longue tenue', 'sub': 'Rouge à lèvres'},
        {'name': 'Color Riche Shine Lipstick', 'brand': 'L\'Oréal Paris', 'price': 25.99, 'desc': 'Rouge à lèvres brillant', 'sub': 'Rouge à lèvres'},
        {'name': 'Voluminous Lash Paradise Mascara', 'brand': 'L\'Oréal Paris', 'price': 28.99, 'desc': 'Mascara volume paradis', 'sub': 'Mascara'},
        {'name': 'Brow Stylist', 'brand': 'L\'Oréal Paris', 'price': 23.99, 'desc': 'Stylo sourcils', 'sub': 'Fond de teint'},
        {'name': 'Infallible Pro-Spray & Set', 'brand': 'L\'Oréal Paris', 'price': 26.99, 'desc': 'Fixateur maquillage', 'sub': 'Fond de teint'},
    ],
    'soins-corps': [
        {'name': 'The Ritual of Namaste Body Cream', 'brand': 'Rituals', 'price': 34.95, 'desc': 'Crème corps ayurvédique', 'sub': 'Lotions hydratantes'},
        {'name': 'The Ritual of Sakura Body Cream', 'brand': 'Rituals', 'price': 32.95, 'desc': 'Crème corps cerisier', 'sub': 'Lotions hydratantes'},
        {'name': 'The Ritual of Karma Body Cream', 'brand': 'Rituals', 'price': 36.95, 'desc': 'Crème corps karma', 'sub': 'Lotions hydratantes'},
        {'name': 'The Ritual of Ayurveda Body Cream', 'brand': 'Rituals', 'price': 35.95, 'desc': 'Crème corps ayurvéda', 'sub': 'Lotions hydratantes'},
        {'name': 'The Ritual of Hammam Body Scrub', 'brand': 'Rituals', 'price': 38.95, 'desc': 'Gommage corps hammam', 'sub': 'Gommages'},
        {'name': 'The Ritual of Namaste Body Scrub', 'brand': 'Rituals', 'price': 36.95, 'desc': 'Gommage corps ayurvédique', 'sub': 'Gommages'},
        {'name': 'The Ritual of Sakura Body Scrub', 'brand': 'Rituals', 'price': 34.95, 'desc': 'Gommage corps cerisier', 'sub': 'Gommages'},
        {'name': 'The Ritual of Karma Body Scrub', 'brand': 'Rituals', 'price': 37.95, 'desc': 'Gommage corps karma', 'sub': 'Gommages'},
        {'name': 'The Ritual of Ayurveda Body Scrub', 'brand': 'Rituals', 'price': 35.95, 'desc': 'Gommage corps ayurvéda', 'sub': 'Gommages'},
        {'name': 'The Ritual of Namaste Body Oil', 'brand': 'Rituals', 'price': 39.95, 'desc': 'Huile corps ayurvédique', 'sub': 'Huiles'},
        {'name': 'The Ritual of Sakura Body Oil', 'brand': 'Rituals', 'price': 37.95, 'desc': 'Huile corps cerisier', 'sub': 'Huiles'},
        {'name': 'The Ritual of Karma Body Oil', 'brand': 'Rituals', 'price': 41.95, 'desc': 'Huile corps karma', 'sub': 'Huiles'},
        {'name': 'The Ritual of Ayurveda Body Oil', 'brand': 'Rituals', 'price': 38.95, 'desc': 'Huile corps ayurvéda', 'sub': 'Huiles'},
        {'name': 'The Ritual of Hammam Body Oil', 'brand': 'Rituals', 'price': 40.95, 'desc': 'Huile corps hammam', 'sub': 'Huiles'},
        {'name': 'Nivea Body Lotion', 'brand': 'Nivea', 'price': 22.99, 'desc': 'Lotion corps hydratante', 'sub': 'Lotions hydratantes'},
        {'name': 'Nivea Rich Nourishing Body Lotion', 'brand': 'Nivea', 'price': 24.99, 'desc': 'Lotion corps nourrissante', 'sub': 'Lotions hydratantes'},
        {'name': 'Nivea Soft Moisturising Cream', 'brand': 'Nivea', 'price': 23.99, 'desc': 'Crème corps douce', 'sub': 'Lotions hydratantes'},
        {'name': 'Nivea Q10 Plus Firming Body Lotion', 'brand': 'Nivea', 'price': 28.99, 'desc': 'Lotion corps fermeté', 'sub': 'Lotions hydratantes'},
        {'name': 'Nivea Sun Protect & Moisture', 'brand': 'Nivea', 'price': 26.99, 'desc': 'Crème solaire hydratante', 'sub': 'Lotions hydratantes'},
        {'name': 'Nivea Sun Protect & Refresh', 'brand': 'Nivea', 'price': 27.99, 'desc': 'Spray solaire rafraîchissant', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive 7 Days', 'brand': 'Garnier', 'price': 21.99, 'desc': 'Lotion corps 7 jours', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive Repair', 'brand': 'Garnier', 'price': 23.99, 'desc': 'Lotion corps réparatrice', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive Nourishing', 'brand': 'Garnier', 'price': 22.99, 'desc': 'Lotion corps nourrissante', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive Smoothing', 'brand': 'Garnier', 'price': 24.99, 'desc': 'Lotion corps lissante', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive Firming', 'brand': 'Garnier', 'price': 25.99, 'desc': 'Lotion corps fermeté', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive Anti-Age', 'brand': 'Garnier', 'price': 26.99, 'desc': 'Lotion corps anti-âge', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive Sun Protection', 'brand': 'Garnier', 'price': 27.99, 'desc': 'Protection solaire corps', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive After Sun', 'brand': 'Garnier', 'price': 23.99, 'desc': 'Après-soleil apaisant', 'sub': 'Lotions hydratantes'},
        {'name': 'Garnier Body Intensive Exfoliating', 'brand': 'Garnier', 'price': 24.99, 'desc': 'Gommage corps exfoliant', 'sub': 'Gommages'},
        {'name': 'Garnier Body Intensive Hand Cream', 'brand': 'Garnier', 'price': 22.99, 'desc': 'Crème mains intensive', 'sub': 'Soins des mains'},
    ],
    'cheveux': [
        {'name': 'Elvive Total Repair 5', 'brand': 'L\'Oréal Paris', 'price': 24.99, 'desc': 'Shampoing réparateur 5 actions', 'sub': 'Shampoings'},
        {'name': 'Elvive Dream Lengths', 'brand': 'L\'Oréal Paris', 'price': 26.99, 'desc': 'Shampoing longueur rêve', 'sub': 'Shampoings'},
        {'name': 'Elvive Extraordinary Oil', 'brand': 'L\'Oréal Paris', 'price': 28.99, 'desc': 'Huile capillaire extraordinaire', 'sub': 'Soins coiffants'},
        {'name': 'Elvive Color Vibrancy', 'brand': 'L\'Oréal Paris', 'price': 27.99, 'desc': 'Shampoing cheveux colorés', 'sub': 'Shampoings'},
        {'name': 'Elvive Volume Filler', 'brand': 'L\'Oréal Paris', 'price': 25.99, 'desc': 'Shampoing volume', 'sub': 'Shampoings'},
        {'name': 'Elvive Smooth Intense', 'brand': 'L\'Oréal Paris', 'price': 24.99, 'desc': 'Shampoing lissant intense', 'sub': 'Shampoings'},
        {'name': 'Elvive Nutri-Gloss', 'brand': 'L\'Oréal Paris', 'price': 23.99, 'desc': 'Shampoing brillance nutritif', 'sub': 'Shampoings'},
        {'name': 'Elvive Fibrology', 'brand': 'L\'Oréal Paris', 'price': 29.99, 'desc': 'Shampoing densité', 'sub': 'Shampoings'},
        {'name': 'Elvive Hyaluron Plump', 'brand': 'L\'Oréal Paris', 'price': 27.99, 'desc': 'Shampoing hydratant hyaluron', 'sub': 'Shampoings'},
        {'name': 'Elvive Wonder Water', 'brand': 'L\'Oréal Paris', 'price': 30.99, 'desc': 'Traitement capillaire eau', 'sub': 'Masques'},
        {'name': 'Ultra Doux Shampoo', 'brand': 'Garnier', 'price': 21.99, 'desc': 'Shampoing ultra doux', 'sub': 'Shampoings'},
        {'name': 'Ultra Doux Conditioner', 'brand': 'Garnier', 'price': 22.99, 'desc': 'Après-shampoing ultra doux', 'sub': 'Après-shampoings'},
        {'name': 'Ultra Doux Hair Mask', 'brand': 'Garnier', 'price': 24.99, 'desc': 'Masque capillaire ultra doux', 'sub': 'Masques'},
        {'name': 'Ultra Doux Oil', 'brand': 'Garnier', 'price': 23.99, 'desc': 'Huile capillaire ultra doux', 'sub': 'Soins coiffants'},
        {'name': 'Fructis Strength & Shine', 'brand': 'Garnier', 'price': 22.99, 'desc': 'Shampoing force brillance', 'sub': 'Shampoings'},
        {'name': 'Fructis Smooth & Shine', 'brand': 'Garnier', 'price': 23.99, 'desc': 'Shampoing lissant brillance', 'sub': 'Shampoings'},
        {'name': 'Fructis Volume & Body', 'brand': 'Garnier', 'price': 24.99, 'desc': 'Shampoing volume', 'sub': 'Shampoings'},
        {'name': 'Fructis Color Shield', 'brand': 'Garnier', 'price': 25.99, 'desc': 'Shampoing protection couleur', 'sub': 'Shampoings'},
        {'name': 'Fructis Repair & Shine', 'brand': 'Garnier', 'price': 26.99, 'desc': 'Shampoing réparation brillance', 'sub': 'Shampoings'},
        {'name': 'Fructis Hydrating', 'brand': 'Garnier', 'price': 23.99, 'desc': 'Shampoing hydratant', 'sub': 'Shampoings'},
        {'name': 'Nivea Hair Care Shampoo', 'brand': 'Nivea', 'price': 22.99, 'desc': 'Shampoing soin cheveux', 'sub': 'Shampoings'},
        {'name': 'Nivea Hair Care Conditioner', 'brand': 'Nivea', 'price': 23.99, 'desc': 'Après-shampoing soin', 'sub': 'Après-shampoings'},
        {'name': 'Nivea Hair Care Hair Mask', 'brand': 'Nivea', 'price': 25.99, 'desc': 'Masque capillaire soin', 'sub': 'Masques'},
        {'name': 'Nivea Hair Care Oil', 'brand': 'Nivea', 'price': 24.99, 'desc': 'Huile capillaire soin', 'sub': 'Soins coiffants'},
        {'name': 'The Ritual of Namaste Shampoo', 'brand': 'Rituals', 'price': 34.95, 'desc': 'Shampoing ayurvédique', 'sub': 'Shampoings'},
        {'name': 'The Ritual of Sakura Shampoo', 'brand': 'Rituals', 'price': 32.95, 'desc': 'Shampoing cerisier', 'sub': 'Shampoings'},
        {'name': 'The Ritual of Karma Shampoo', 'brand': 'Rituals', 'price': 36.95, 'desc': 'Shampoing karma', 'sub': 'Shampoings'},
        {'name': 'The Ritual of Ayurveda Shampoo', 'brand': 'Rituals', 'price': 35.95, 'desc': 'Shampoing ayurvéda', 'sub': 'Shampoings'},
        {'name': 'The Ritual of Hammam Shampoo', 'brand': 'Rituals', 'price': 37.95, 'desc': 'Shampoing hammam', 'sub': 'Shampoings'},
        {'name': 'The Ritual of Namaste Conditioner', 'brand': 'Rituals', 'price': 34.95, 'desc': 'Après-shampoing ayurvédique', 'sub': 'Après-shampoings'},
    ],
    'parfums': [
        {'name': 'The Ritual of Namaste Eau de Parfum', 'brand': 'Rituals', 'price': 49.95, 'desc': 'Parfum ayurvédique'},
        {'name': 'The Ritual of Sakura Eau de Parfum', 'brand': 'Rituals', 'price': 47.95, 'desc': 'Parfum cerisier'},
        {'name': 'The Ritual of Karma Eau de Parfum', 'brand': 'Rituals', 'price': 51.95, 'desc': 'Parfum karma'},
        {'name': 'The Ritual of Ayurveda Eau de Parfum', 'brand': 'Rituals', 'price': 49.95, 'desc': 'Parfum ayurvéda'},
        {'name': 'The Ritual of Hammam Eau de Parfum', 'brand': 'Rituals', 'price': 50.95, 'desc': 'Parfum hammam'},
        {'name': 'The Ritual of Namaste Body Mist', 'brand': 'Rituals', 'price': 34.95, 'desc': 'Brume parfumée ayurvédique'},
        {'name': 'The Ritual of Sakura Body Mist', 'brand': 'Rituals', 'price': 32.95, 'desc': 'Brume parfumée cerisier'},
        {'name': 'The Ritual of Karma Body Mist', 'brand': 'Rituals', 'price': 36.95, 'desc': 'Brume parfumée karma'},
        {'name': 'The Ritual of Ayurveda Body Mist', 'brand': 'Rituals', 'price': 35.95, 'desc': 'Brume parfumée ayurvéda'},
        {'name': 'The Ritual of Hammam Body Mist', 'brand': 'Rituals', 'price': 37.95, 'desc': 'Brume parfumée hammam'},
        {'name': 'Nivea Deodorant', 'brand': 'Nivea', 'price': 21.99, 'desc': 'Déodorant protection'},
        {'name': 'Nivea Roll-On', 'brand': 'Nivea', 'price': 22.99, 'desc': 'Déodorant roll-on'},
        {'name': 'Nivea Spray', 'brand': 'Nivea', 'price': 23.99, 'desc': 'Déodorant spray'},
        {'name': 'Garnier Deodorant', 'brand': 'Garnier', 'price': 21.99, 'desc': 'Déodorant fraîcheur'},
        {'name': 'Garnier Roll-On', 'brand': 'Garnier', 'price': 22.99, 'desc': 'Déodorant roll-on'},
        {'name': 'Garnier Spray', 'brand': 'Garnier', 'price': 23.99, 'desc': 'Déodorant spray'},
        {'name': 'L\'Oréal Paris Deodorant', 'brand': 'L\'Oréal Paris', 'price': 24.99, 'desc': 'Déodorant protection'},
        {'name': 'L\'Oréal Paris Roll-On', 'brand': 'L\'Oréal Paris', 'price': 25.99, 'desc': 'Déodorant roll-on'},
        {'name': 'L\'Oréal Paris Spray', 'brand': 'L\'Oréal Paris', 'price': 26.99, 'desc': 'Déodorant spray'},
        {'name': 'Maybelline Deodorant', 'brand': 'Maybelline', 'price': 21.99, 'desc': 'Déodorant fraîcheur'},
        {'name': 'Maybelline Roll-On', 'brand': 'Maybelline', 'price': 22.99, 'desc': 'Déodorant roll-on'},
        {'name': 'Maybelline Spray', 'brand': 'Maybelline', 'price': 23.99, 'desc': 'Déodorant spray'},
        {'name': 'The Ordinary Deodorant', 'brand': 'The Ordinary', 'price': 24.90, 'desc': 'Déodorant naturel'},
        {'name': 'The Inkey List Deodorant', 'brand': 'The Inkey List', 'price': 23.90, 'desc': 'Déodorant pur'},
        {'name': 'Rituals Deodorant', 'brand': 'Rituals', 'price': 28.95, 'desc': 'Déodorant rituel'},
        {'name': 'Rituals Roll-On', 'brand': 'Rituals', 'price': 29.95, 'desc': 'Déodorant roll-on'},
        {'name': 'Rituals Spray', 'brand': 'Rituals', 'price': 30.95, 'desc': 'Déodorant spray'},
        {'name': 'Rituals Body Mist', 'brand': 'Rituals', 'price': 32.95, 'desc': 'Brume parfumée'},
        {'name': 'Rituals Eau de Toilette', 'brand': 'Rituals', 'price': 44.95, 'desc': 'Eau de toilette'},
        {'name': 'Rituals Eau de Cologne', 'brand': 'Rituals', 'price': 42.95, 'desc': 'Eau de cologne'},
    ],
    'accessoires': [
        {'name': 'Makeup Brush Set', 'brand': 'Real Techniques', 'price': 34.99, 'desc': 'Set pinceaux maquillage'},
        {'name': 'Beauty Sponge', 'brand': 'Real Techniques', 'price': 21.99, 'desc': 'Éponge beauté'},
        {'name': 'Makeup Mirror LED', 'brand': 'Simplehuman', 'price': 89.99, 'desc': 'Miroir maquillage LED'},
        {'name': 'Brush Holder', 'brand': 'Real Techniques', 'price': 24.99, 'desc': 'Porte-pinceaux'},
        {'name': 'Makeup Organizer', 'brand': 'Simplehuman', 'price': 49.99, 'desc': 'Organisateur maquillage'},
        {'name': 'Makeup Bag', 'brand': 'Real Techniques', 'price': 22.99, 'desc': 'Trousse maquillage'},
        {'name': 'Brush Cleaner', 'brand': 'Real Techniques', 'price': 23.99, 'desc': 'Nettoyant pinceaux'},
        {'name': 'Makeup Remover Cloths', 'brand': 'Real Techniques', 'price': 21.99, 'desc': 'Lingettes démaquillantes'},
        {'name': 'Eyelash Curler', 'brand': 'Tweezerman', 'price': 28.99, 'desc': 'Recourbe-cils'},
        {'name': 'Tweezers', 'brand': 'Tweezerman', 'price': 26.99, 'desc': 'Pince à épiler'},
        {'name': 'Nail Clipper Set', 'brand': 'Tweezerman', 'price': 24.99, 'desc': 'Coupe-ongles'},
        {'name': 'Hair Brush', 'brand': 'Tangle Teezer', 'price': 25.99, 'desc': 'Brosse cheveux'},
        {'name': 'Detangling Brush', 'brand': 'Tangle Teezer', 'price': 26.99, 'desc': 'Brosse démêlante'},
        {'name': 'Hair Dryer', 'brand': 'Remington', 'price': 89.99, 'desc': 'Sèche-cheveux'},
        {'name': 'Straightening Iron', 'brand': 'Remington', 'price': 79.99, 'desc': 'Lisseur'},
        {'name': 'Curling Iron', 'brand': 'Remington', 'price': 69.99, 'desc': 'Fer à boucler'},
        {'name': 'Hair Clips', 'brand': 'Goody', 'price': 21.99, 'desc': 'Pinces à cheveux'},
        {'name': 'Hair Ties', 'brand': 'Goody', 'price': 22.99, 'desc': 'Élastiques cheveux'},
        {'name': 'Hair Scrunchie', 'brand': 'Goody', 'price': 23.99, 'desc': 'Chouchou'},
        {'name': 'Hair Band', 'brand': 'Goody', 'price': 24.99, 'desc': 'Bandeau cheveux'},
        {'name': 'Makeup Palette', 'brand': 'Z Palette', 'price': 34.99, 'desc': 'Palette maquillage'},
        {'name': 'Brush Set Pro', 'brand': 'Zoeva', 'price': 89.99, 'desc': 'Set pinceaux pro'},
        {'name': 'Beauty Blender', 'brand': 'Beautyblender', 'price': 28.99, 'desc': 'Éponge beauté'},
        {'name': 'Makeup Sponge Set', 'brand': 'Beautyblender', 'price': 49.99, 'desc': 'Set éponges'},
        {'name': 'Brush Cleaner Mat', 'brand': 'Sigma', 'price': 29.99, 'desc': 'Tapis nettoyant'},
        {'name': 'Makeup Brush Set', 'brand': 'Sigma', 'price': 79.99, 'desc': 'Set pinceaux'},
        {'name': 'Beauty Sponge', 'brand': 'Sigma', 'price': 24.99, 'desc': 'Éponge beauté'},
        {'name': 'Makeup Mirror', 'brand': 'Conair', 'price': 59.99, 'desc': 'Miroir maquillage'},
        {'name': 'LED Mirror', 'brand': 'Conair', 'price': 69.99, 'desc': 'Miroir LED'},
        {'name': 'Travel Mirror', 'brand': 'Conair', 'price': 29.99, 'desc': 'Miroir voyage'},
    ]
}

# Générer le code TypeScript
ts_code = '''import { Product, Category, Review } from '@/types';

/**
 * Convertit un nom de produit en nom de fichier image
 */
function productNameToImageName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\\s+/g, '_')
    .replace(/[^a-z0-9_àáâãäåèéêëìíîïòóôõöùúûüýÿç]/gi, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '') + '.jpg';
}

/**
 * Génère le chemin vers l'image d'un produit
 */
function getProductImagePath(productName: string): string {
  return `/image-products/${productNameToImageName(productName)}`;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Soins du visage',
    slug: 'soins-visage',
    description: 'Crèmes, sérums, masques et produits de soin pour votre visage',
    image: getProductImagePath('Soins du visage'),
    subCategories: ['Crèmes hydratantes', 'Sérums', 'Masques', 'Nettoyants', 'Protection solaire']
  },
  {
    id: '2',
    name: 'Maquillage',
    slug: 'maquillage',
    description: 'Produits de maquillage pour sublimer votre beauté naturelle',
    image: getProductImagePath('Maquillage'),
    subCategories: ['Fond de teint', 'Rouge à lèvres', 'Mascara', 'Palettes', 'Highlighter']
  },
  {
    id: '3',
    name: 'Soins du corps',
    slug: 'soins-corps',
    description: 'Lotions, huiles et soins pour un corps radieux',
    image: getProductImagePath('Soins du corps'),
    subCategories: ['Lotions hydratantes', 'Huiles', 'Gommages', 'Soins des mains']
  },
  {
    id: '4',
    name: 'Cheveux',
    slug: 'cheveux',
    description: 'Shampoings, après-shampoings et soins capillaires',
    image: getProductImagePath('Cheveux'),
    subCategories: ['Shampoings', 'Après-shampoings', 'Masques', 'Soins coiffants']
  },
  {
    id: '5',
    name: 'Parfums',
    slug: 'parfums',
    description: 'Fragrances élégantes et raffinées',
    image: getProductImagePath('Parfums')
  },
  {
    id: '6',
    name: 'Accessoires beauté',
    slug: 'accessoires',
    description: 'Pinceaux, éponges et outils de beauté',
    image: getProductImagePath('Accessoires beauté')
  },
];

export const products: Product[] = [
'''

product_id = 1
for cat_slug, cat_products in products_data.items():
    ts_code += f'  // {cat_slug.upper().replace("-", " ")}\n'
    for p in cat_products:
        image_name = f"{p['name']} {p['brand']}"
        rating = round(4.0 + (product_id % 10) * 0.1, 1)
        reviews = (product_id % 500) + 50
        is_best = product_id % 7 == 0
        
        ts_code += f'''  {{
    id: '{product_id}',
    name: '{p["name"]}',
    description: '{p["desc"]}',
    longDescription: '{p["desc"]}. Produit de qualité professionnelle disponible aux Pays-Bas.',
    price: {p["price"]},
    image: getProductImagePath('{image_name}'),
    category: '{cat_slug}',
    subCategory: '{p.get("sub", "")}',
    brand: '{p["brand"]}',
    rating: {rating},
    reviewsCount: {reviews},
    inStock: true,
    isBestSeller: {str(is_best).lower()},
    badges: {['Bestseller'] if is_best else []}
  }},
'''
        product_id += 1

ts_code += '''];

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userName: 'Sophie M.',
    rating: 5,
    comment: 'Excellent produit ! Ma peau est visiblement plus radieuse après seulement 2 semaines d\'utilisation.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: '2',
    productId: '1',
    userName: 'Emma L.',
    rating: 5,
    comment: 'Je recommande vivement ce sérum. Texture agréable et résultats impressionnants.',
    date: '2024-01-10',
    verified: true
  },
  {
    id: '3',
    productId: '24',
    userName: 'Léa D.',
    rating: 5,
    comment: 'Ma couleur préférée ! Tenue exceptionnelle et texture très confortable.',
    date: '2024-01-20',
    verified: true
  },
  {
    id: '4',
    productId: '20',
    userName: 'Camille R.',
    rating: 5,
    comment: 'Fond de teint parfait ! Couvrance excellente et tenue toute la journée.',
    date: '2024-01-22',
    verified: true
  },
  {
    id: '5',
    productId: '37',
    userName: 'Marie K.',
    rating: 5,
    comment: 'Lotion super hydratante, ma peau est douce comme la soie !',
    date: '2024-01-18',
    verified: true
  },
];
'''

print(ts_code)
