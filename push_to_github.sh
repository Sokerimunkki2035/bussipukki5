#!/bin/bash
# Push vercel.json changes to GitHub

echo "Staging vercel.json..."
git add vercel.json

echo "Committing changes..."
git commit -m "Fix vercel.json output directory"

echo "Pushing to GitHub..."
git push https://Sokerimunkki2035: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@github.com/Sokerimunkki2035/bussipukki5.git main

echo "Done! ✅"
