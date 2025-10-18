#!/bin/bash
# Push Netlify changes to GitHub

echo "📦 Staging Netlify files..."
git add netlify/ netlify.toml package.json

echo "💾 Committing changes..."
git commit -m "Add Netlify configuration and serverless functions"

echo "🚀 Pushing to GitHub..."
git push https://Sokerimunkki2035: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@github.com/Sokerimunkki2035/bussipukki5.git main

echo "✅ Done! Ready for Netlify deployment!"
