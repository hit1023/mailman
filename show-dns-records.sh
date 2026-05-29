#!/bin/bash
# DKIM鍵生成後にDNS登録用レコードを表示するスクリプト
# 使い方: ./show-dns-records.sh

DOMAIN="yahoi.jp"
SELECTOR="mail"
KEY_FILE="./data/opendkim/keys/${DOMAIN}/${SELECTOR}.txt"

echo "===== DNS設定が必要なレコード ====="
echo ""
echo "【1. SPFレコード】"
echo "  タイプ: TXT"
echo "  ホスト: @  (または ${DOMAIN}.)"
echo "  値:     v=spf1 mx a ip4:<サーバのIPアドレス> ~all"
echo ""
echo "【2. DKIMレコード】"
if [ -f "$KEY_FILE" ]; then
  echo "  タイプ: TXT"
  echo "  ホスト: ${SELECTOR}._domainkey.${DOMAIN}"
  echo "  値:"
  cat "$KEY_FILE"
else
  echo "  ※ まず docker compose up -d を実行してDKIM鍵を生成してください"
  echo "  鍵ファイルの場所: ${KEY_FILE}"
fi
echo ""
echo "【3. DMARCレコード】"
echo "  タイプ: TXT"
echo "  ホスト: _dmarc.${DOMAIN}"
echo "  値:     v=DMARC1; p=none; rua=mailto:postmaster@${DOMAIN}"
echo ""
echo "【4. MXレコード（任意・送信専用でも設定推奨）】"
echo "  タイプ: MX"
echo "  ホスト: @"
echo "  値:     10 mail.${DOMAIN}"
echo ""
echo "【5. Aレコード】"
echo "  タイプ: A"
echo "  ホスト: mail"
echo "  値:     <サーバのIPアドレス>"
