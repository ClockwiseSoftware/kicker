--issue KICK-29 (add user complaint reason)
    ALTER TABLE complaints ADD COLUMN reason varchar(256);