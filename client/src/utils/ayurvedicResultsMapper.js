const DOSHAS = ['Vata', 'Pitta', 'Kapha'];

// Per request: use any single image for all herbs.
export const DEFAULT_HERB_IMAGE =
	'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800';

const asArray = (value) => (Array.isArray(value) ? value : []);

const toDisplayCondition = (detectedConditions) => {
	const list = asArray(detectedConditions).filter(Boolean);
	if (!list.length) return 'Ayurvedic Assessment';
	return list.join(', ');
};

const buildDoshaProfile = (aiResult) => {
	const imbalance = asArray(aiResult?.dosha_imbalance)
		.map((d) => (typeof d === 'string' ? d.trim() : ''))
		.filter(Boolean);

	if (imbalance.length) {
		const primary = imbalance;
		const secondary = DOSHAS.filter((d) => !primary.includes(d));
		return { primary, secondary };
	}

	const scores = aiResult?.dosha_scores;
	if (scores && typeof scores === 'object') {
		const entries = DOSHAS.map((d) => ({ dosha: d, score: Number(scores[d] ?? 0) }))
			.sort((a, b) => b.score - a.score);

		const maxScore = entries[0]?.score ?? 0;
		const primary = maxScore > 0 ? entries.filter((e) => e.score === maxScore).map((e) => e.dosha) : ['Mixed'];
		const secondary = DOSHAS.filter((d) => !primary.includes(d));
		return { primary, secondary };
	}

	return { primary: ['Mixed'], secondary: DOSHAS };
};

export const mapAiReportToAyurvedicResultsData = (aiResult) => {
	const dietaryTips = asArray(aiResult?.diet_tips).filter(Boolean);
	const lifestyleTips = asArray(aiResult?.lifestyle_tips).filter(Boolean);
	const safetyNotes = asArray(aiResult?.safety_notes).filter(Boolean);

	const remedies = asArray(aiResult?.remedies);
	const herbalRemedies = remedies
		.map((item) => {
			const name = item?.title;
			if (!name) return null;
			return {
				name,
				usage: item?.usage || '',
				primary_action: item?.description || 'Traditional Ayurvedic herbal support',
				dosha_effect: asArray(item?.dosha_effect).filter(Boolean),
				contraindications: asArray(item?.contraindications).filter(Boolean),
				image: DEFAULT_HERB_IMAGE,
			};
		})
		.filter(Boolean);

	const therapies = asArray(aiResult?.therapies)
		.map((t) => {
			const name = t?.name;
			if (!name) return null;
			return {
				name,
				description: t?.description || '',
			};
		})
		.filter(Boolean);

	return {
		condition: toDisplayCondition(aiResult?.detected_conditions),
		dosha_profile: buildDoshaProfile(aiResult),
		herbal_remedies: herbalRemedies,
		therapies,
		dietary_tips: dietaryTips,
		lifestyle_tips: lifestyleTips,
		safety_notes: safetyNotes,
	};
};
