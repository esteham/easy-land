<?php

return [
    'paths' => ['api/*'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'https://eland.xetroot.com',
        'http://localhost:5173',
        'https://eland-chi.vercel.app',
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Content-Disposition'], 
    
    'max_age' => 0,
    
    'supports_credentials' => false, 
];
