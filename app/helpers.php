<?php

function userPointsClass($delta) {
    return $delta > 0 ? 'win' : 'lose';
}

function gamePointClass($a, $b) {
    if ($a > $b)
        return 'win';
    elseif ($a < $b)
        return 'lose';
    else
        return 'draw';
}