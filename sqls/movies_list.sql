SELECT
	a.id,
	a.title,
	a.synopsis,
	a.amount - (SELECT COUNT(*) FROM rents WHERE id_movie = a.id AND `status` = 'leased') as total_remaining
FROM 
	movies a
GROUP BY 
	a.id

	