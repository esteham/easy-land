<?php

return [
    'paths' => ['api/*'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'https://eland.xetroot.com',
        'http://localhost:5173',
        'https://e-land.netlify.app',
        'https://eland-chi.vercel.app',
        'https://elands.onrender.com',
        'https://eland.pages.dev',
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Content-Disposition'], 
    
    'max_age' => 0,
    
    'supports_credentials' => false, 
];
