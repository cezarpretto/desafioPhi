SELECT 
	a.created_at,
	b.title,
	c.name AS user
FROM 
	rents a
JOIN
	movies b ON a.id_movie = b.id
JOIN
	users c ON a.id_user = c.id
WHERE 
	id_user = 1